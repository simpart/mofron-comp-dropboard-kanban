/**
 * @file   mofron-comp-kanbanboard/index.js
 * @author simpart
 */
let mf = require('mofron');
let Header = require('mofron-comp-header');
let Text   = require('mofron-comp-text');
let Dropbd = require('mofron-comp-dropboard');
let Center = require('mofron-effect-center');
let Shadow = require('mofron-effect-shadow');
let Drag   = require('mofron-event-drag');

/**
 * @class mofron.comp.kanbanboard
 * @brief KanbanBoard component for mofron
 */
mf.comp.KanbanBoard = class extends Dropbd {
    
    constructor (po) {
        try {
            super();
            this.name('KanbanBoard');
            this.m_drgid = new Array();
            this.prmOpt(po);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * initialize dom contents
     * 
     * @param prm : 
     */
    initDomConts (prm) {
        try {
            let dm = new mf.Dom('div', this);
            this.adom().addChild(dm);
            this.target(dm);
            
            this.addChild(
                new mf.Component({
                    style    : { 'border' : 'solid 1px rgb(190,190,190)' },
                    addChild : new Header({
                        style     : { 'align-items' : 'center' },
                        addChild  : new Text({
                            addEffect : new Center(true, false),
                            text      : (null === prm) ? '' : prm,
                            size      : 25,
                            color     : new mf.Color(255,255,255)
                        }),
                        bind      : false,
                        height    : 40
                    })
                })
            );
            
            let conts = new mf.Dom({
                tag       : 'div',
                component : this,
                style     : { height : '100%',
                              border : 'solid 1px rgb(190,190,190)' }
            });
            dm.addChild(conts);
            this.target(conts);
            this.eventTgt(dm);
            this.styleTgt(dm);
            
            this.addEffect(
                new Shadow({
                    speed : 0.5,
                    value : 15
                }),
                false
            );
            
            super.initDomConts();
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * execuse re-position when card was finished drag.
     *
     */
    getDragEndEvent () {
        try {
            let fnc = (tgt, tp, prm) => {
                try {
                    setTimeout(
                        (prm) => {
                            try {
console.log("drag end");
                                prm.reposChild();
                                //let eff = prm.effect();
                                //for (let eidx in eff) {
                                //    eff[eidx][0].execute(false);
                                //}
                            } catch (e) {
                                console.error(e.stack);
                                throw e;
                            }
                        },
                        100,
                        prm
                    );
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            let ret = new Drag({
                addType : 'dragend',
                handler : new mf.Param(fnc, this)
            });
            this.m_drgid.push(ret.getId());
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    getDragIdList () {
        try {
            return this.m_drgid;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    addChild (chd, idx) {
        try {
            let chd_evt = chd.event();
            let d_lst   = this.getDragIdList();
            let add_flg = true;
            for (let cidx in chd_evt) {
                for (let didx in d_lst) {
                    if (d_lst[didx] === chd_evt[cidx].getId()) {
                        add_flg = false;
                        break;
                    }
                }
            }
            
            if (true === add_flg) {
                chd.addEvent(this.getDragEndEvent());
            }
            super.addChild(chd, idx);
            
            
            /* re-position child */
            this.reposChild();
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    reposChild () {
        try {
            let sz       = this.size();
            let rate_flg = ('number' !== typeof sz[0]) ? true : false;
            let chd_wid  = (true === rate_flg) ? '90%' : Math.floor(sz[0] * 0.9) + 'px';
            let chd_left = (true === rate_flg) ? '5%'  : Math.floor((sz[0] - chd_wid) / 2) + 'px';
            let rep_chd  = this.child();
            
            for (let cidx in rep_chd) {
                if (true === mf.func.isInclude(rep_chd[cidx], 'Card')) {
                    rep_chd[cidx].style({
                        width    : chd_wid    ,
                        position : 'relative' ,
                        left     : chd_left   ,
                        top      : 15 + (cidx * 15) + 'px'
                    });
                }
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * drop event on this board
     */
    dropped (cmp) {
        try {
            let chd = this.child();
            for (let cidx in chd) {
                if (chd[cidx].getId() === cmp.getId()) {
                    /* parameter component is already dropped */
                    return;
                }
            }
            /* param component is shifted from other board */
            super.dropped(cmp);
            this.dragLeave();
            this.addChild(cmp);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mofron.comp.KanbanBoard;
